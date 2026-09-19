import { useEffect } from 'react';
import { BACKEND_URL } from '../config';

function MagicVerify() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            window.location.replace(`${BACKEND_URL}/api/auth/magic/verify?token=${encodeURIComponent(token)}`);
        } else {
            window.location.replace('/login?error=invalid_link');
        }
    }, []);

    return <p className="no-feedback">Verifying your sign-in link... 🌸</p>;
}

export default MagicVerify;