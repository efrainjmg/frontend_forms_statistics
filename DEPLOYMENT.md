# Deployment Guide

## Prerequisites

Before deploying, ensure you have:

- AWS CLI installed and configured
- Terraform installed (v1.0+)
- Node.js 18+ installed
- GitHub repository set up
- AWS account with appropriate permissions

## Step-by-Step Deployment

### Step 1: Configure API Endpoints

1. Get the API Gateway URLs from your backend modules:
   - Module 1 (URL Shortener)
   - Module 2 (Redirection Service)
   - Module 3 (Statistics API)

2. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your actual API endpoints

### Step 2: Deploy Infrastructure

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Create `terraform.tfvars`:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` with a unique bucket name:
   ```hcl
   bucket_name = "url-shortener-[your-name]-[random-number]"
   ```
   > **Important**: S3 bucket names must be globally unique!

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Preview the changes:
   ```bash
   terraform plan
   ```

6. Apply the infrastructure:
   ```bash
   terraform apply
   ```
   Type `yes` when prompted.

7. **Save the outputs!** You'll need these values:
   ```
   cloudfront_distribution_id = "E1234567890ABC"
   cloudfront_domain_name = "d1234567890abc.cloudfront.net"
   s3_bucket_name = "url-shortener-..."
   ```

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to: Settings → Secrets and variables → Actions
3. Add the following secrets:

   | Secret Name | Value | Where to find |
   |-------------|-------|---------------|
   | `AWS_ACCESS_KEY_ID` | Your AWS access key | AWS IAM Console |
   | `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | AWS IAM Console |
   | `S3_BUCKET_NAME` | From Terraform output | `terraform output s3_bucket_name` |
   | `CLOUDFRONT_DISTRIBUTION_ID` | From Terraform output | `terraform output cloudfront_distribution_id` |
   | `CLOUDFRONT_DOMAIN` | From Terraform output | `terraform output cloudfront_domain_name` |
   | `API_URL_SHORTENER` | Your Module 1 API | From your backend deployment |
   | `API_REDIRECT` | Your Module 2 API | From your backend deployment |
   | `API_STATS` | Your Module 3 API | From your backend deployment |

### Step 4: Deploy the Application

1. Commit and push your code:
   ```bash
   git add .
   git commit -m "Initial frontend deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Install dependencies
   - Build the React app
   - Upload to S3
   - Invalidate CloudFront cache

3. Monitor the deployment in the Actions tab

4. Once complete, access your site at:
   ```
   https://[your-cloudfront-domain].cloudfront.net
   ```

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

1. **Build the project**:
   ```bash
   npm install
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
   ```

3. **Invalidate CloudFront cache**:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 18+)
- Check for syntax errors in your code

### 403/404 Errors on Routes
- Ensure CloudFront custom error responses are configured (should be automatic with Terraform)
- Verify the distribution has been deployed (can take 15-20 minutes)

### API Calls Failing
- Check that environment variables are set correctly in GitHub Secrets
- Verify API endpoints are accessible
- Check browser console for CORS errors
- Ensure backend APIs have CORS headers configured

### CloudFront Cache Issues
- If changes aren't visible, invalidate the cache manually:
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
  ```

### Terraform Errors

**Bucket name already exists**:
- Change the `bucket_name` in `terraform.tfvars` to something unique

**Access denied**:
- Verify AWS credentials are configured: `aws configure`
- Check IAM permissions include S3 and CloudFront access

## Updating the Application

To deploy updates:

1. Make your code changes
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. GitHub Actions will automatically redeploy

## Destroying Infrastructure

⚠️ **WARNING**: This will delete all resources and your website will go offline!

```bash
cd terraform
terraform destroy
```

Type `yes` when prompted.

## Production Checklist

Before going to production:

- [ ] All API endpoints are configured and working
- [ ] Environment variables are set in GitHub Secrets
- [ ] Terraform infrastructure is deployed
- [ ] CloudFront distribution is fully deployed (15-20 min wait)
- [ ] Test all routes (/, /stats, /short/:code)
- [ ] Test on mobile devices
- [ ] Verify analytics tracking works
- [ ] Check error handling for invalid codes
- [ ] Monitor CloudWatch logs for errors
- [ ] Set up CloudWatch alarms (optional)
- [ ] Configure custom domain (optional)

## Cost Considerations

AWS resources in this project:
- **S3**: ~$0.023 per GB/month (very low for a static site)
- **CloudFront**: Free tier includes 1TB data transfer out
- **Data Transfer**: Minimal for typical usage

Estimated monthly cost for moderate traffic: **< $5/month**

---

**Need help?** Check the main [README.md](README.md) for more information.
