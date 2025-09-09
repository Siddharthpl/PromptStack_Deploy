# PromptHub Deployment Guide

This guide explains how to deploy PromptHub using the CI/CD pipeline and Docker Hub.

## 🏗️ Architecture

- **Build**: GitHub Actions builds Docker images
- **Push**: Images are pushed to Docker Hub
- **Deploy**: EC2 pulls images and runs containers

## 📋 Prerequisites

### GitHub Secrets Required

Set these secrets in your GitHub repository settings:

1. `DOCKERHUB_USERNAME` - Your Docker Hub username
2. `DOCKERHUB_TOKEN` - Your Docker Hub access token
3. `EC2_HOST` - Your EC2 instance IP address
4. `EC2_USERNAME` - EC2 username (usually `ubuntu` or `ec2-user`)
5. `EC2_SSH_KEY` - Your private SSH key for EC2
6. `BACKEND_ENV` - Backend environment variables
7. `FRONTEND_ENV` - Frontend environment variables

### EC2 Setup

1. **Install Docker and Docker Compose**:

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

   # Logout and login again to apply docker group changes
   ```

2. **Clone Repository**:
   ```bash
   git clone <your-repo-url>
   cd Prompthub
   ```

## 🚀 Deployment Methods

### Method 1: Automatic CI/CD (Recommended)

1. **Push to main branch** - This triggers the GitHub Actions workflow
2. **Monitor the workflow** in GitHub Actions tab
3. **Check deployment** on your EC2 instance

### Method 2: Manual Deployment

1. **Set environment variables**:

   ```bash
   export DOCKERHUB_USERNAME=your-dockerhub-username
   export DOCKERHUB_TOKEN=your-dockerhub-token  # Optional, for private repos
   ```

2. **Run deployment script**:
   ```bash
   ./deploy.sh
   ```

### Method 3: Manual Docker Commands

1. **Login to Docker Hub**:

   ```bash
   docker login -u your-dockerhub-username
   ```

2. **Pull and start services**:
   ```bash
   export DOCKERHUB_USERNAME=your-dockerhub-username
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🔧 Configuration

### Environment Variables

Create `.env.production` files:

**Backend** (`backend/.env.production`):

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://host:port
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RABBITMQ_URL=amqp://username:password@host:port
```

**Frontend** (`frontend/.env.production`):

```env
NEXT_PUBLIC_API_URL=http://your-ec2-ip:4000
NEXT_PUBLIC_GRAPHQL_URL=http://your-ec2-ip:4000/graphql
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Nginx Configuration

The nginx configuration is included in the `nginx/` directory and will be mounted as a volume.

## 📊 Monitoring

### Check Container Status

```bash
docker ps
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Restart Services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

## 🔍 Troubleshooting

### Common Issues

1. **SSH Connection Failed**:

   - Check EC2 security group allows SSH (port 22)
   - Verify SSH key format in GitHub secrets
   - Ensure EC2 instance is running

2. **Docker Pull Failed**:

   - Check Docker Hub credentials
   - Verify image names and tags
   - Check network connectivity

3. **Container Won't Start**:

   - Check environment variables
   - View container logs
   - Verify port availability

4. **Database Connection Issues**:
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall rules

### Debug Commands

```bash
# Check Docker version
docker --version
docker-compose --version

# Check running containers
docker ps -a

# Check container logs
docker logs <container-name>

# Check system resources
df -h
free -h
```

## 🔄 Updates

To update the application:

1. **Push changes** to the main branch
2. **GitHub Actions** will automatically build and push new images
3. **EC2 will pull** the latest images on next deployment

Or manually:

```bash
./deploy.sh
```

## 📝 Notes

- The deployment script automatically cleans up unused Docker images
- All containers are configured to restart automatically
- Logs are configured with rotation to prevent disk space issues
- The nginx reverse proxy handles routing between frontend and backend
