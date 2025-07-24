# Deployment Instructions

## Local Development

```bash
# Install dependencies
pnpm install

# Set up database
pnpm run prisma:push
# or for migrations
pnpm run prisma:migrate

# Start development server
pnpm run dev
```

## Production Build

```bash
# Clean and build
pnpm run build

# Start production server
pnpm run start
```

## AWS Deployment

### Environment Variables
Make sure these environment variables are set in your AWS environment:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

### Deployment Steps

1. **Install dependencies:**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Generate Prisma client:**
   ```bash
   pnpm run prisma:generate
   ```

3. **Run database migrations (if needed):**
   ```bash
   pnpm run prisma:deploy
   ```

4. **Build the application:**
   ```bash
   pnpm run build
   ```

5. **Start the production server:**
   ```bash
   pnpm run start
   ```

### AWS Specific Notes

- Use `pnpm run start` instead of `pnpm run dev` in production
- The compiled JavaScript files will be in the `dist/` folder
- Make sure Node.js version is >= 18.0.0
- Consider using PM2 or similar process manager for production

### Process Manager (Recommended)

Install PM2 for better process management:
```bash
npm install -g pm2
pm2 start dist/server.js --name "backend"
pm2 startup
pm2 save
```

This will prevent the auto-stopping issue you experienced with Bun. 