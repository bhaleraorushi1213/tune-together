import { useSignIn } from "@clerk/react"
import { Button } from "./ui/button";
import GoogleLogo from "/google_logo.svg"

const SignInOAuthButtons = () => {
  const { signIn, fetchStatus } = useSignIn();

  if (fetchStatus === 'fetching') return null;

  const signInWithGoogle = async () => {
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/auth-callback",
      })

    } catch (error) {
      console.log("SSO error: ", error);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
      className="w-full bg-surface-hover hover:bg-surface-raised text-text border border-border h-11 z-10 cursor-pointer"
    >
      <img src={GoogleLogo} alt="google-logo" className="size-6 object-cover" />
      Continue with Google
    </Button>
  )
}

export default SignInOAuthButtons;