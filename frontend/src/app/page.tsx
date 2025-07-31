import { LandingPage } from '@/components/landing/LandingPage';

export default function Home() {
  return (
    <div>
       <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
      <LandingPage />
    </div>
  );
}
