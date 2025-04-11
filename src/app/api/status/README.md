# Status Endpoint

## GET /api/status

Retrieves the status of a batch processing job.

### Request
- Method: GET
- Query Parameter: `id` (required) - The batch ID to check

### Response
- Status: 200 on success
- Body: 
  ```json
  {
    "id": "batch_id",
    "status": "pending|completed",
    "files": [
      {
        "name": "filename",
        "type": "mime_type",
        "size": file_size,
        "status": {
          "status": "pending|completed|failed",
          "validationErrors": {
            "type": "error_type",
            "field": "field_name"
          }
        }
      }
    ]
  }
  ```

### CORS
- Allowed Origin: http://localhost:8000
- Allowed Methods: GET, OPTIONS
- Allowed Headers: Content-Type

### Error Handling
- 400: Missing ID parameter
- 404: Batch not found
- 500: Server error 