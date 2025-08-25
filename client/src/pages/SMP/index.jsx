import { getName, getRollNumber } from "@/lib/auth_utility";
import Spinner from "@/components/spinner";
import Header from "@/components/Header";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Footer from "@/components/Footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BrowserAuthError, InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import SmpForm from "@/components/SmpForm";
import SMP_Form from "@/components/SmpForm/form";

const SMPPage = () => {
  const { accounts, instance } = useMsal();
  const [idToken, setIdToken] = useState();
  const [idTokenClaims, setIdTokenClaims] = useState();
  const [loading, setLoading] = useState(true);
  const [studData, setStudData] = useState({});

  const navigate = useNavigate();
  const contentRef = useRef();
  const request = { scopes: [] };

  const accessTokenRequest = {
    account: accounts[0],
  };

  useEffect(() => {
    instance.acquireTokenSilent(request).then(tokenResponse => {
      setIdToken(tokenResponse.idToken);
      setIdTokenClaims(tokenResponse.idTokenClaims);
    }).catch(async (error) => {
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenRedirect(request);
      } else if (error instanceof BrowserAuthError) {
        navigate("/");
        return;
      }

      // handle other errors
      console.log(error);
    });
  }, [instance]);

  useEffect(() => {
    if (!idToken) return;
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/nonfresher/allocated-details`,
      {
        headers: { "X-Alloc8-IDToken": idToken },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.disabled) {
          alert("You cannot book room yet. Please wait for an official mail.");
          navigate("/");
        } else if (data.error) {
          navigate("/allotroom");
          return;
        }
        setLoading(false);
        setStudData(data);
        console.log(data);
      })

  }, [idToken]);
  const submit = async (values) => {
    console.log(values)
    instance.acquireTokenSilent(accessTokenRequest).then(res => {
      fetch(`http://localhost:8500/api/smp/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Alloc8-IDToken": res.idToken,
        },
        body: JSON.stringify(values)
      }).then(res => {
        if (res.status == 200) {
          alert("Submitted successfully");
        } else {
          alert("Error in submission");
        }
      });
    });
  }

  return (<>
    <div className="flex flex-col justify-center items-center">
      <img src="/SMP.svg" className="w-[30rem] p-12" alt="Logo" />
      <div className="bg-white rounded-xl shadow-lg p-4 w-[100vw] md:w-auto md:p-12">

        <div className="mb-6">
          <span className="font-semibold text-2xl uppercase" >{getName(idTokenClaims)}</span><br />
          <span className="uppercase text-md tracking-wide" >{getRollNumber(idTokenClaims)}</span><br />
        </div>
        <SMP_Form idTokenClaims={idTokenClaims} submitAction={submit} />
      </div>
    </div>
  </>);

};

export default SMPPage;
/* vi: set et sw=2: */
