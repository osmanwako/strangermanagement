# Guest Management System

A full-stack guest management system built with Laravel (Backend) and React (Frontend) with role-based access control.

## Features

- **Authentication System**: Secure login with role-based access (Admin/Secretary)
- **Visitor Management**: Register, view, update, and delete visitor records
- **Weapon Registration**: Track weapons brought by visitors
- **Real-time Dashboard**: Live statistics and activity timeline
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Backend
- **Laravel 11** - PHP framework
- **Laravel Sanctum** - API authentication
- **MySQL** - Database
- **Eloquent ORM** - Database operations

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

## Quick Start

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 16+
- MySQL 8.0+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd guest-management-backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Update database configuration in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=guest_management
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations and seed database:**
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Start the server:**
   ```bash
   php artisan serve
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd efp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Default Credentials

The system comes with pre-seeded users:

### Admin User
- **Email:** admin@example.com
- **Password:** password
- **Access:** Full system access

### Secretary User
- **Email:** secretary@example.com
- **Password:** password
- **Access:** Visitor management only

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Visitors
- `GET /api/visitors` - List all visitors
- `POST /api/visitors` - Create new visitor
- `GET /api/visitors/{id}` - Get specific visitor
- `PUT /api/visitors/{id}` - Update visitor
- `DELETE /api/visitors/{id}` - Delete visitor

### Weapons
- `GET /api/weapons` - List all weapons
- `POST /api/weapons` - Create new weapon
- `GET /api/weapons/{id}` - Get specific weapon
- `PUT /api/weapons/{id}` - Update weapon
- `DELETE /api/weapons/{id}` - Delete weapon

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin/secretary)
- `email_verified_at` - Email verification timestamp
- `created_at`, `updated_at` - Timestamps

### Visits Table
- `id` - Primary key
- `full_name` - Visitor's full name
- `gender` - Gender (male/female/other)
- `id_number` - ID number
- `visit_reason` - Purpose of visit
- `host_name` - Host's name
- `entry_time` - Entry timestamp
- `exit_time` - Exit timestamp (nullable)
- `created_at`, `updated_at` - Timestamps

### Weapons Table
- `id` - Primary key
- `visitor_id` - Foreign key to visits table
- `weapon_type` - Type of weapon
- `weapon_description` - Weapon description
- `created_at`, `updated_at` - Timestamps

## Project Structure

```
efp/
├── guest-management-backend/     # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/     # API controllers
│   │   └── Models/              # Eloquent models
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/            # Database seeders
│   └── routes/
│       └── api.php             # API routes
├── src/                        # React frontend
│   ├── component/              # React components
│   ├── api.js                  # API configuration
│   └── App.jsx                 # Main app component
└── package.json               # Frontend dependencies
```

## Troubleshooting

### Common Issues

1. **Login not working:**
   - Ensure both backend and frontend servers are running
   - Check database connection
   - Verify CORS configuration

2. **Database connection errors:**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

3. **CORS errors:**
   - Check `config/cors.php` configuration
   - Verify frontend URL is in allowed origins

### Development Commands

```bash
# Backend
php artisan serve                    # Start Laravel server
php artisan migrate:fresh --seed     # Reset database
php artisan route:list              # List all routes
php artisan tinker                  # Laravel REPL

# Frontend
npm run dev                         # Start development server
npm run build                       # Build for production
npm run preview                     # Preview production build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
