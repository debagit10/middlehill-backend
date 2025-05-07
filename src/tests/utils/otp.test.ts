import { otpServices } from "../../utils/otp";
import { OTP } from "../../models/otpModel";

jest.mock("../../models/otpModel");

describe("generate otp", () => {
  it("should return a 6-digit number", async () => {
    const otp = otpServices.generateOtp();

    expect(typeof otp).toBe("string");
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });
});

describe("store otp", () => {
  it("should store a otp in the database with correct values", async () => {
    const user_id = "user123";
    const otp_code = "123456";

    const mockCreate = jest.fn().mockResolvedValue(true);
    OTP.create = mockCreate;

    await otpServices.storeOtp(user_id, otp_code);

    expect(mockCreate).toHaveBeenCalledWith({
      user_id,
      otp_code,
      expiresAt: expect.any(Date),
    });

    const expiresIn = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = Date.now();
    const expiresAt = expect.objectContaining({
      getTime: expect.any(Function),
    });

    expect(
      mockCreate.mock.calls[0][0].expiresAt.getTime()
    ).toBeGreaterThanOrEqual(now + expiresIn - 1000);
    expect(mockCreate.mock.calls[0][0].expiresAt.getTime()).toBeLessThanOrEqual(
      now + expiresIn + 1000
    );
  });
});

describe("verifyOtp", () => {
  it("should return success when OTP is valid and not expired", async () => {
    const mockOtp = {
      user_id: "user123",
      otp_code: "123456",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      used: false,
    };

    // Mock findOne to return a valid OTP object
    OTP.findOne = jest.fn().mockResolvedValue({ dataValues: mockOtp });

    const result = await otpServices.verifyOtp("user123", "123456");

    expect(result).toEqual({ success: "Account verified" });
    expect(OTP.findOne).toHaveBeenCalledWith({
      where: { user_id: "user123", otp_code: "123456" },
    });
  });

  it("should return an error when OTP is expired", async () => {
    const mockOtp = {
      user_id: "user123",
      otp_code: "123456",
      expiresAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago (expired)
      used: false,
    };

    // Mock findOne to return an expired OTP object
    OTP.findOne = jest.fn().mockResolvedValue({ dataValues: mockOtp });

    const result = await otpServices.verifyOtp("user123", "123456");

    expect(result).toEqual({ error: "OTP expired" });
  });

  it("should return an error when OTP is used", async () => {
    const mockOtp = {
      user_id: "user123",
      otp_code: "123456",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      used: true, // OTP has already been used
    };

    // Mock findOne to return an OTP object where used is true
    OTP.findOne = jest.fn().mockResolvedValue({ dataValues: mockOtp });

    const result = await otpServices.verifyOtp("user123", "123456");

    expect(result).toEqual({ error: "OTP expired" });
  });

  it("should return an error when OTP does not exist", async () => {
    // Mock findOne to return null (OTP not found)
    OTP.findOne = jest.fn().mockResolvedValue(null);

    const result = await otpServices.verifyOtp("user123", "123456");

    expect(result).toEqual({ error: "Invalid OTP" });
  });
});
