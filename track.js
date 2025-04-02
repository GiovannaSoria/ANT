import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  // Tu configuración de Firebase aquí
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { email, action } = req.query;
  
  try {
    // Registra el clic en Firestore
    await addDoc(collection(db, "clicks"), {
      email,
      action,
      timestamp: serverTimestamp(),
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    // Redirige al usuario a la página correspondiente según la acción
    let redirectUrl = 'https://ant-ecuador.vercel.app/';
    
    switch(action) {
      case 'ver_infraccion':
        redirectUrl += 'infraccion';
        break;
      case 'impugnar':
        redirectUrl += 'impugnar';
        break;
      case 'ver_evidencia':
        redirectUrl += 'evidencia';
        break;
    }

    res.redirect(302, `${redirectUrl}?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error('Error al registrar el clic:', error);
    res.redirect(302, 'https://ant-ecuador.vercel.app/error');
  }
}