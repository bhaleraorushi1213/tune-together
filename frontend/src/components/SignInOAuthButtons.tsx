import { useSignIn } from "@clerk/react"
import { Button } from "./ui/button";

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
      className="w-full bg-surface-hover hover:bg-surface-raised text-text border border-border h-11 z-10"
    >
      Continue with Google
    </Button>
  )
}

export default SignInOAuthButtons;