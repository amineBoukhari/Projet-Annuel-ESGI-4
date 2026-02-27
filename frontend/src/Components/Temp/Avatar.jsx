import { useMemo } from 'react';

export default function Avatar({ attributes, seed = 'Sacha carton' }) {
  const avatar = useMemo(() => {
    const url = new URL('https://api.dicebear.com/9.x/dylan/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    return url.href;
  }, [seed]);

  return <img src={avatar} alt="Avatar" className={attributes} />;
}
