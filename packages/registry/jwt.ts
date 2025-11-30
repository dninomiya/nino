import { jwtVerify, SignJWT } from "jose";

const enc = new TextEncoder();
const secret = enc.encode(process.env.REGISTRY_JWT_SECRET!);
const issuer = "nino-registry";
const audience = "shadcn-registry";

export async function issueRegistryJWT() {
  return new SignJWT({ scope: "registry:read" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret);
}

export async function verifyRegistryJWT(token: string | null) {
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secret, {
      issuer: issuer,
      audience: audience,
    });

    return true;
  } catch (error) {
    return false;
  }
}
