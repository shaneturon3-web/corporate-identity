import { parseRole, roleMeetsPermission } from "../../../src/lib/auth/roles";
import { computeAssociateHoldings } from "../../../src/lib/holding/compensation-matrix";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const role = parseRole(url.searchParams.get("role"));

  if (!roleMeetsPermission(role, "BACKEND")) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const gross = Number(url.searchParams.get("grossCents") ?? 250000);
  const leads = Number(url.searchParams.get("leads") ?? 3);
  const referral = Number(url.searchParams.get("referralCents") ?? 40000);

  return Response.json(computeAssociateHoldings(gross, leads, referral));
};
