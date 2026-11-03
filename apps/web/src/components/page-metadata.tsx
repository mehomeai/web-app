import { useEffect } from 'react';
import { useLocation } from 'wouter';

const pages: Record<string, [string, string]> = {
  '/': ['Me — Your intelligence. Yours.', 'Meet Me: a home AI computer and mobile companion. Local intelligence, private conversations, and rules you control. Join the launch waitlist.'],
  '/how-it-works': ['How Me works — Intelligence at home', 'Explore how Me Home runs local models, stores private conversations on its own drive, and connects to outside services only for approved tasks.'],
  '/signup': ['Join the Me waitlist — Home-first intelligence', 'Sign up for Me launch updates. Discover personal intelligence with a home AI computer, a mobile app, and control over your data and rules.'],
};

export function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const [title, description] = pages[location] ?? ['Page not found — Me', 'Explore Me, home-first personal intelligence.'];
    document.title = title;
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ]) document.querySelector(selector)?.setAttribute('content', content);
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
