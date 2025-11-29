variable "bucket_name" {
  description = "S3 bucket name for static website hosting (must be globally unique)"
  type        = string
  
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.bucket_name))
    error_message = "Bucket name must be lowercase alphanumeric with hyphens, not starting or ending with hyphen"
  }
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "production"
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production"
  }
}

# Optional: For custom domain with HTTPS
# variable "domain_name" {
#   description = "Custom domain name for the website"
#   type        = string
#   default     = ""
# }

# variable "acm_certificate_arn" {
#   description = "ARN of ACM certificate for HTTPS (must be in us-east-1)"
#   type        = string
#   default     = ""
# }
