import { getName } from "@/lib/auth_utility";
import { User } from "lucide-react";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import { useState, useEffect } from "react";

function Header() {
  const { instance } = useMsal();
  const [idTokenClaims, setIdTokenClaims] = useState();
  const request = { scopes: [] };

  useEffect(() => {
    instance.acquireTokenSilent(request).then(tokenResponse => {
      setIdTokenClaims(tokenResponse.idTokenClaims);
    }).catch(async (error) => {
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenRedirect(request);
      }

      // handle other errors
      console.log(error);
    });
  }, [instance]);


  return (
      <div className="w-screen h-[60px] leading-[60px] py-2 px-5 bg-slate-100 relative">
        <img src="/logo.png" className="h-[30px] my-[5px]" alt="Alloc8" />
        <div className="flexbox absolute right-5 top-0 h-[60px] w-auto capitalize">
          <AuthenticatedTemplate>
            <div>{getName(idTokenClaims)}</div>
          </AuthenticatedTemplate>
          <div className="avatar">
            <User></User>
          </div>
        </div>
      </div>
  );
}
export default Header;
/* vi: set et sw=2: */
