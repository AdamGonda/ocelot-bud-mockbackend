# Upload Endpoint

## POST /api/upload

Accepts file uploads and creates a batch processing record.

### Request
- Method: POST
- Content-Type: multipart/form-data
- Files should be sent with keys starting with "file" (e.g., file1, file2, etc.)

### Response
- Status: 200 on success
- Body: 
  ```json
  {
    "id": "batch_id",
    "isDone": "timestamp",
    "files": [
      {
        "name": "filename",
        "type": "mime_type",
        "size": file_size,
        "status": { "status": "pending" }
      }
    ],
    "status": "pending"
  }
  ```

### CORS
- Allowed Origin: http://localhost:8000
- Allowed Methods: POST, OPTIONS
- Allowed Headers: Content-Type

### Error Handling
- 400: No files uploaded
- 500: Server error 