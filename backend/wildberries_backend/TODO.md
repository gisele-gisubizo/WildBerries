# TODO: Implement Clean Seller's Registration

## Step 1: Clean and Rewrite userController.ts
- Remove corrupted code (NaN, incomplete lines)
- Add missing controllers:
  - approveSellerController
  - rejectSellerController
  - verifyOtpController
  - loginController
  - getPendingSellersController
  - getApprovedSellersController
  - getRejectedSellersController
- Ensure registerSellerController handles all fields (name, email, phone, password, category, address, idCopy, licenseDoc)
- Integrate OTP for sellers like customers

## Step 2: Clean and Rewrite userService.ts
- Fix corrupted verifyOTP function
- Ensure all service functions are properly defined
- Add OTP generation and email sending for sellers in registerSeller

## Step 3: Verify Integration
- Check that routes import all controllers correctly
- Ensure schema validation matches controller expectations
- Test registration endpoint (optional, based on user preference)

## Completed:
- Step 1: userController.ts is clean and has all controllers
- Step 2: userService.ts is clean and has all services, including OTP for sellers
- Step 3: Integration verified - routes, schemas, entities match
- Testing: Server starts successfully, seller registration endpoint works with all fields and file uploads, returns success message with OTP verification prompt
- Categories endpoints added to index.ts and tested
- Categories seeded with their respective fields as per documentation (Fashion & Clothing, Electronics & Gadgets, etc., each with specific required fields like sizes, color, material, etc.)
