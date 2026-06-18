#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "Testing Travel Plans API"
echo "=========================================="
echo ""

# ========== CREATE USER ==========
echo "1️⃣ POST /users - Create a user"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice'$(date +%s)'@example.com"
  }')
echo "$USER_RESPONSE" | jq .
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.id')
echo "Created user ID: $USER_ID"
echo ""

# ========== CREATE ANOTHER USER ==========
echo "2️⃣ POST /users - Create another user"
USER2_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob'$(date +%s)'@example.com"
  }')
echo "$USER2_RESPONSE" | jq .
USER2_ID=$(echo "$USER2_RESPONSE" | jq -r '.id')
echo "Created user ID: $USER2_ID"
echo ""

# ========== GET ALL USERS ==========
echo "3️⃣ GET /users - List all users"
curl -s -X GET "$BASE_URL/users" | jq .
echo ""

# ========== GET SINGLE USER ==========
echo "4️⃣ GET /users/:id - Get single user"
curl -s -X GET "$BASE_URL/users/$USER_ID" | jq .
echo ""

# ========== CREATE TRAVEL PLAN ==========
echo "5️⃣ POST /travel-plans - Create a travel plan"
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/travel-plans" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": '$USER_ID',
    "title": "Japan Summer Vacation",
    "destinationCity": "Tokyo",
    "destinationCountry": "Japan",
    "startDate": "2026-07-01",
    "endDate": "2026-07-10",
    "budget": 2500
  }')
echo "$PLAN_RESPONSE" | jq .
PLAN_ID=$(echo "$PLAN_RESPONSE" | jq -r '.id')
echo "Created travel plan ID: $PLAN_ID"
echo ""

# ========== CREATE ANOTHER TRAVEL PLAN ==========
echo "6️⃣ POST /travel-plans - Create another travel plan for user 2"
PLAN2_RESPONSE=$(curl -s -X POST "$BASE_URL/travel-plans" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": '$USER2_ID',
    "title": "Paris Honeymoon",
    "destinationCity": "Paris",
    "destinationCountry": "France",
    "startDate": "2026-09-01",
    "endDate": "2026-09-14",
    "budget": 5000
  }')
echo "$PLAN2_RESPONSE" | jq .
PLAN2_ID=$(echo "$PLAN2_RESPONSE" | jq -r '.id')
echo "Created travel plan ID: $PLAN2_ID"
echo ""

# ========== GET ALL TRAVEL PLANS ==========
echo "7️⃣ GET /travel-plans - List all travel plans"
curl -s -X GET "$BASE_URL/travel-plans" | jq .
echo ""

# ========== GET SINGLE TRAVEL PLAN ==========
echo "8️⃣ GET /travel-plans/:id - Get single travel plan"
curl -s -X GET "$BASE_URL/travel-plans/$PLAN_ID" | jq .
echo ""

# ========== GET USER'S TRAVEL PLANS ==========
echo "9️⃣ GET /users/:userId/travel-plans - Get user's travel plans"
curl -s -X GET "$BASE_URL/users/$USER_ID/travel-plans" | jq .
echo ""

# ========== UPDATE USER ==========
echo "🔟 PUT /users/:id - Update a user"
curl -s -X PUT "$BASE_URL/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson-Updated",
    "email": "alice.updated'$(date +%s)'@example.com"
  }' | jq .
echo ""

# ========== UPDATE TRAVEL PLAN ==========
echo "1️⃣1️⃣ PUT /travel-plans/:id - Update a travel plan"
curl -s -X PUT "$BASE_URL/travel-plans/$PLAN_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Japan Summer Vacation - Extended",
    "budget": 3500
  }' | jq .
echo ""

# ========== DELETE TRAVEL PLAN ==========
echo "1️⃣2️⃣ DELETE /travel-plans/:id - Delete a travel plan"
curl -s -X DELETE "$BASE_URL/travel-plans/$PLAN2_ID" -w "\nStatus: %{http_code}\n"
echo ""

# ========== DELETE USER ==========
echo "1️⃣3️⃣ DELETE /users/:id - Delete a user"
curl -s -X DELETE "$BASE_URL/users/$USER2_ID" -w "\nStatus: %{http_code}\n"
echo ""

# ========== VERIFY DELETIONS ==========
echo "1️⃣4️⃣ GET /users - Verify user was deleted"
curl -s -X GET "$BASE_URL/users" | jq .
echo ""

echo "=========================================="
echo "✅ Tests complete!"
echo "=========================================="