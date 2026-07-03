import { useSignIn } from "@clerk/react"
import { Button } from "./ui/button.tsx"

const SignInOAuthButtons = () => {
  const { signIn, fetchStatus } = useSignIn();

  if (fetchStatus === 'fetching') return null;

  const signInWithGoogle = async () => {
    try {
      await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/auth-callback",
      })
      
    } catch (error) {
      console.log("SSO error: ", error);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-11 z-10"
    >
      Continue with Google
    </Button>
  )
}

export default SignInOAuthButtons;