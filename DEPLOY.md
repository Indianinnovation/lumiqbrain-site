# LumiqBrain.ai — Deployment Guide

## Option A: AWS Amplify (Easiest — Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial lumiqbrain.ai landing page"
git remote add origin https://github.com/<your-username>/lumiqbrain-site.git
git push -u origin main
```

### Step 2: Deploy on Amplify
1. Go to https://console.aws.amazon.com/amplify
2. Click **"New app" → "Host web app"**
3. Connect your GitHub repo
4. Amplify auto-detects `amplify.yml` — click **Save and deploy**

### Step 3: Connect lumiqbrain.ai domain
1. In Amplify → **Domain management → Add domain**
2. Enter `lumiqbrain.ai`
3. Follow DNS instructions (add CNAME records at your registrar)
4. SSL certificate is provisioned automatically ✅

---

## Option B: AWS S3 + CloudFront (Manual)

### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://lumiqbrain-ai --region us-east-1
aws s3 website s3://lumiqbrain-ai --index-document index.html --error-document index.html
```

### Step 2: Apply Bucket Policy
```bash
aws s3api put-bucket-policy \
  --bucket lumiqbrain-ai \
  --policy file://s3-bucket-policy.json
```

### Step 3: Upload Site Files
```bash
aws s3 sync . s3://lumiqbrain-ai \
  --exclude "*.json" \
  --exclude "*.yml" \
  --exclude "*.md" \
  --exclude ".git/*"
```

### Step 4: Request SSL Certificate (ACM)
1. Go to https://console.aws.amazon.com/acm → **us-east-1 region**
2. Request a public certificate for `lumiqbrain.ai` and `www.lumiqbrain.ai`
3. Validate via DNS — add the CNAME record at your registrar
4. Copy the Certificate ARN and replace `<YOUR_ACM_CERTIFICATE_ARN>` in `cloudfront-config.json`

### Step 5: Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

### Step 6: Point Domain to CloudFront
Add these DNS records at your domain registrar:
```
Type: CNAME  Name: www    Value: <cloudfront-domain>.cloudfront.net
Type: ALIAS  Name: @      Value: <cloudfront-domain>.cloudfront.net
```

### Step 7: Update site (future deployments)
```bash
aws s3 sync . s3://lumiqbrain-ai --delete \
  --exclude "*.json" --exclude "*.yml" --exclude "*.md"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <YOUR_DISTRIBUTION_ID> \
  --paths "/*"
```

---

## Estimated Cost
| Service        | Cost              |
|----------------|-------------------|
| S3 Storage     | ~$0.00/month      |
| CloudFront     | $0/month (free tier) |
| ACM SSL Cert   | Free              |
| Route 53 DNS   | $0.50/month (optional) |
| **Total**      | **~$0–$1/month**  |
