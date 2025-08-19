<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VisitorController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $destination = $request->query('destination');
        $hasWeapon = $request->query('has_weapon');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');
        $perPage = min(100, max(5, (int)$request->query('per_page', 10)));

        $query = Visitor::with('weapons')->whereNull('archived_at');

        if ($q) {
            $query->where(function($x) use ($q) {
                $x->where('name','like', "%{$q}%")
                  ->orWhere('id_number','like', "%{$q}%")
                  ->orWhere('destination','like', "%{$q}%")
                  ->orWhere('visit_purpose','like', "%{$q}%");
            });
        }
        if ($destination) $query->where('destination', $destination);
        if (!is_null($hasWeapon) && $hasWeapon !== '') {
            $hasWeapon = filter_var($hasWeapon, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $hasWeapon ? $query->has('weapons') : $query->doesntHave('weapons');
        }
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);

        $query->withCount('weapons')->orderBy('created_at', 'desc');

        return $query->paginate($perPage)->withQueryString();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
            'id_type' => 'nullable|string|max:50',
            'wereda' => 'nullable|string|max:120',
            'subcity' => 'nullable|string|max:120',
            'photo' => 'nullable|string', // base64 or URL
            'destination' => 'required|string|max:255',
            'visit_purpose' => 'required|string|max:500',
            'vip' => 'boolean',
            'weapons' => 'array',
            'weapons.*.type' => 'required_with:weapons|string|max:255',
            'weapons.*.serial' => 'required_with:weapons|string|max:255',
        ]);

        // Save visitor
        $visitor = Visitor::create([
            'name' => $data['name'],
            'id_number' => $data['id_number'],
            'id_type' => $data['id_type'] ?? null,
            'wereda' => $data['wereda'] ?? null,
            'subcity' => $data['subcity'] ?? null,
            'photo_url' => $data['photo'] ?? null,
            'destination' => $data['destination'],
            'visit_purpose' => $data['visit_purpose'],
            'vip' => $data['vip'] ?? false,
        ]);

        foreach ($data['weapons'] ?? [] as $w) {
            $visitor->weapons()->create([
                'type' => $w['type'],
                'serial' => $w['serial'],
                // generate asset_tag server-side if you like
            ]);
        }

        return response()->json($visitor->load('weapons')->append('weapons_count'), 201);
    }

    public function archive($id)
    {
        $v = Visitor::findOrFail($id);
        $v->archived_at = now();
        $v->save();
        return response()->json(['archived' => true]);
    }

    public function export(Request $request): StreamedResponse
    {
        // reuse index filters
        $request->merge(['per_page' => 1000000]);
        $collection = $this->index($request)->getCollection();

        $filename = 'visitors_' . now()->format('Ymd_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($collection) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Name','ID Number','ID Type','Destination','Purpose','VIP','Weapons Count','Created At']);
            foreach ($collection as $v) {
                fputcsv($handle, [
                    $v->name,
                    $v->id_number,
                    $v->id_type,
                    $v->destination,
                    $v->visit_purpose,
                    $v->vip ? 'Yes' : 'No',
                    $v->weapons()->count(),
                    optional($v->created_at)->toDateTimeString(),
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function stats()
    {
        $today = now()->toDateString();
        $todayVisitors = Visitor::whereDate('created_at', $today)->whereNull('archived_at')->count();
        $withWeapons = Visitor::has('weapons')->whereDate('created_at', $today)->count();
        $destinations = Visitor::selectRaw('destination, count(*) as total')->whereDate('created_at', $today)->groupBy('destination')->orderByDesc('total')->limit(5)->get();

        return response()->json([
            'today_visitors' => $todayVisitors,
            'with_weapons' => $withWeapons,
            'destinations' => $destinations,
        ]);
    }
}
