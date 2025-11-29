output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_website_endpoint" {
  description = "S3 bucket website endpoint"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name (use this to access your site)"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_url" {
  description = "Full HTTPS URL to access your site"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}
