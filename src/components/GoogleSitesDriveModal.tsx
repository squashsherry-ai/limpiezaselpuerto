import React, { useState, useEffect } from 'react';
import { 
  Globe, HardDrive, Copy, Check, Download, ExternalLink, 
  X, Code, Sparkles, HelpCircle, CheckCircle2, FileText, Layers,
  LogIn, LogOut, AlertCircle, Loader2, ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  uploadHtmlToGoogleDrive, 
  DriveUploadedFile 
} from '../lib/driveAuth';

interface GoogleSitesDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleSitesDriveModal({ isOpen, onClose }: GoogleSitesDriveModalProps) {
  const [copied, setCopied] = useState(false);
  const [iframeHeight, setIframeHeight] = useState('800px');
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [driveStatus, setDriveStatus] = useState<{ 
    type: 'success' | 'error' | 'info'; 
    message: string;
    fileData?: DriveUploadedFile;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'embed' | 'instructions' | 'preview' | 'drive'>('embed');
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);

  // Initialize and observe Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasToken(!!token);
      },
      () => {
        setGoogleUser(null);
        setHasToken(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  // Determine current app live URL
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href.split('?')[0].split('#')[0] 
    : 'https://ais-pre-5ibkchckzhr4lcficmvo6u-55538747069.europe-west2.run.app';

  // Generate Google Sites Embed Code
  const embedCode = `<!-- CÓDIGO DE INSERCIÓN PARA GOOGLE SITES - LIMPIEZAS EL PUERTO -->
<div style="width: 100%; height: ${iframeHeight}; overflow: hidden; border-radius: 16px; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.12); border: 1px solid #e2e8f0;">
  <iframe 
    src="${currentUrl}" 
    width="100%" 
    height="100%" 
    style="border: none; width: 100%; height: 100%;" 
    allow="geolocation; camera; microphone" 
    title="Limpiezas El Puerto - Reserva y Presupuestos en Línea">
  </iframe>
</div>`;

  // Full standalone HTML document formatted for saving to Google Drive
  const driveHtmlDocument = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Integración Google Sites - Limpiezas El Puerto</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    h1 { color: #0284c7; margin-top: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
    p { line-height: 1.6; color: #475569; font-size: 14px; }
    .code-box { background: #0f172a; color: #38bdf8; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 13px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; margin: 20px 0; border: 1px solid #1e293b; }
    .steps { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin-bottom: 8px; font-size: 14px; color: #0369a1; }
    .btn { display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Limpiezas El Puerto - Código de Integración para Google Sites</h1>
    <p>Este archivo contiene el código HTML de incorporación listo para integrar la plataforma de presupuestos y reservas de Limpiezas El Puerto en tu sitio de Google Sites.</p>
    
    <div class="steps">
      <strong>Pasos para integrar en Google Sites:</strong>
      <ol>
        <li>Abre tu sitio en <strong>Google Sites</strong> (sites.google.com).</li>
        <li>En la barra lateral derecha, haz clic en <strong>Insertar</strong> &gt; <strong>Incorporar (&lt;&gt;)</strong>.</li>
        <li>Selecciona la pestaña <strong>Código de incorporación</strong>.</li>
        <li>Copia el código de abajo y pégalo. Haz clic en <strong>Siguiente</strong> y luego <strong>Insertar</strong>.</li>
        <li>Ajusta el tamaño del contenedor en la página y haz clic en <strong>Publicar</strong>.</li>
      </ol>
    </div>

    <h3>Código iFrame:</h3>
    <div class="code-box">${embedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

    <h3>Enlace Directo a la Aplicación:</h3>
    <a href="${currentUrl}" target="_blank" class="btn">Abrir Aplicación en Vivo</a>
  </div>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([driveHtmlDocument], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Limpiezas_El_Puerto_Google_Sites_Integration.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Google Login Handler
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setDriveStatus(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasToken(true);
        setDriveStatus({
          type: 'info',
          message: `Conectado como ${res.user.displayName || res.user.email}. Listo para sincronizar con Google Drive.`
        });
      }
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setDriveStatus({
        type: 'error',
        message: err?.message || 'No se pudo completar la autenticación con Google.'
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Google Logout Handler
  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setHasToken(false);
      setDriveStatus({
        type: 'info',
        message: 'Has cerrado sesión de tu cuenta de Google.'
      });
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  // Prompt confirmation before writing to Google Drive
  const handleInitiateDriveSave = () => {
    if (!googleUser || !hasToken) {
      // Prompt user to sign in first
      handleGoogleSignIn();
      return;
    }
    setShowConfirmUpload(true);
  };

  // Perform upload to Google Drive
  const handleExecuteDriveSave = async () => {
    setShowConfirmUpload(false);
    setIsSavingToDrive(true);
    setDriveStatus({ type: 'info', message: 'Guardando archivo en tu Google Drive...' });

    try {
      const fileName = `Limpiezas_El_Puerto_Google_Sites_${new Date().toISOString().slice(0, 10)}.html`;
      const uploaded = await uploadHtmlToGoogleDrive(
        fileName, 
        driveHtmlDocument,
        'Configuración de integración y código iFrame para Google Sites - Limpiezas El Puerto'
      );

      setDriveStatus({
        type: 'success',
        message: `¡Archivo "${uploaded.name}" guardado exitosamente en tu Google Drive!`,
        fileData: uploaded
      });
    } catch (err: any) {
      console.error('Error saving to Google Drive:', err);
      setDriveStatus({
        type: 'error',
        message: err?.message || 'Ocurrió un error al guardar en Google Drive. Intenta iniciar sesión nuevamente o descarga el archivo local.'
      });
    } finally {
      setIsSavingToDrive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900/60 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-white flex items-center gap-2">
                Integración con Google Sites & Drive
                <span className="bg-sky-500/20 text-sky-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-sky-500/30">
                  Activo
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Incrustación en Google Sites y exportación directa a Google Drive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            id="btn-close-google-sites-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Google Account Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {googleUser ? (
              <>
                {googleUser.photoURL ? (
                  <img 
                    src={googleUser.photoURL} 
                    alt={googleUser.displayName || 'Google User'} 
                    className="h-8 w-8 rounded-full border border-sky-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {(googleUser.displayName || googleUser.email || 'G').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{googleUser.displayName || 'Usuario de Google'}</span>
                    <span className="bg-emerald-950 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-800">
                      Conectado
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{googleUser.email}</div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                <span>Conecta tu cuenta de Google para guardar la configuración directamente en Drive</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {googleUser ? (
              <button
                onClick={handleGoogleLogout}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-800/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                id="btn-google-signout"
                title="Cerrar sesión de Google"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Desconectar</span>
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                id="btn-google-signin"
              >
                {isSigningIn ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                )}
                <span>Iniciar sesión con Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'embed'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>Código Embed HTML</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'drive'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="h-4 w-4" />
            <span>Guardar en Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Guía de Instalación</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Vista Previa</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {activeTab === 'embed' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Altura del iFrame (Google Sites):
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ajusta la altura recomendada para que la calculadora y la web encajen perfectamente.
                  </p>
                </div>
                <select
                  value={iframeHeight}
                  onChange={(e) => setIframeHeight(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-sky-300 font-bold focus:outline-none focus:border-sky-500"
                >
                  <option value="650px">650px (Compacto)</option>
                  <option value="800px">800px (Recomendado)</option>
                  <option value="1000px">1000px (Completo)</option>
                  <option value="100vh">100vh (Pantalla entera)</option>
                </select>
              </div>

              {/* Code Snippet Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="h-3.5 w-3.5 text-sky-400" />
                    Código iFrame HTML listo para Google Sites
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/80 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    id="btn-copy-embed-code"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed select-all">
                  <pre>{embedCode}</pre>
                </div>
              </div>

              {/* Action Buttons: Save to Google Drive & Download HTML */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={handleInitiateDriveSave}
                  disabled={isSavingToDrive}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg hover:shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
                  id="btn-save-to-google-drive"
                >
                  {isSavingToDrive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <HardDrive className="h-4 w-4" />
                  )}
                  <span>Guardar Paquete en Google Drive</span>
                </button>

                <button
                  onClick={handleDownloadHtml}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer"
                  id="btn-download-html-local"
                >
                  <Download className="h-4 w-4 text-sky-400" />
                  <span>Descargar Fichero .HTML</span>
                </button>
              </div>

              {driveStatus && (
                <div className={`p-3.5 rounded-xl border text-xs flex flex-col gap-2 ${
                  driveStatus.type === 'success' 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : driveStatus.type === 'error'
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                    : 'bg-sky-950/60 border-sky-800 text-sky-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {driveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-sky-400 shrink-0" />
                    )}
                    <span className="font-medium">{driveStatus.message}</span>
                  </div>

                  {driveStatus.fileData?.webViewLink && (
                    <div className="pt-1">
                      <a
                        href={driveStatus.fileData.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Abrir archivo en Google Drive</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'drive' && (
            <div className="space-y-5">
              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Almacenamiento Directo en Google Drive
                    </h3>
                    <p className="text-xs text-slate-400">
                      Guarda el archivo de integración con el código embebido y documentación directamente en tu cuenta de Google.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <div className="text-xs text-slate-300">
                    <strong className="text-white block mb-1">Contenido que se guardará:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                      <li>Código HTML con el iFrame configurado con la URL activa de la aplicación.</li>
                      <li>Instrucciones paso a paso para Google Sites (sites.google.com).</li>
                      <li>Acceso directo al portal de reservas y panel de control.</li>
                    </ul>
                  </div>

                  {googleUser ? (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {googleUser.photoURL ? (
                          <img 
                            src={googleUser.photoURL} 
                            alt={googleUser.displayName || 'Google User'} 
                            className="h-10 w-10 rounded-full border border-sky-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
                            {(googleUser.displayName || googleUser.email || 'G').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{googleUser.displayName || 'Usuario Google'}</div>
                          <div className="text-[11px] text-slate-400">{googleUser.email}</div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            ✓ Permisos de Google Drive activos
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleInitiateDriveSave}
                        disabled={isSavingToDrive}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg hover:shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
                        id="btn-drive-tab-save"
                      >
                        {isSavingToDrive ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <HardDrive className="h-4 w-4" />
                        )}
                        <span>Guardar en mi Drive</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center py-6 gap-3">
                      <p className="text-xs text-slate-300 max-w-md">
                        Inicia sesión con tu cuenta de Google para transferir los archivos de integración directamente a tu almacenamiento personal de Google Drive.
                      </p>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                        className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                        id="btn-drive-tab-signin"
                      >
                        {isSigningIn ? (
                          <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                          </svg>
                        )}
                        <span>Conectar con Google</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {driveStatus && (
                <div className={`p-4 rounded-xl border text-xs flex flex-col gap-2 ${
                  driveStatus.type === 'success' 
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : driveStatus.type === 'error'
                    ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                    : 'bg-sky-950/60 border-sky-800 text-sky-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {driveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />
                    )}
                    <span className="font-medium text-sm">{driveStatus.message}</span>
                  </div>

                  {driveStatus.fileData?.webViewLink && (
                    <div className="pt-2 flex items-center gap-3">
                      <a
                        href={driveStatus.fileData.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors shadow"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Abrir archivo en Google Drive</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Pasos para publicar en tu web de Google Sites
                </h3>

                <ol className="space-y-3 text-xs text-slate-300 leading-relaxed list-decimal list-inside">
                  <li className="pl-1">
                    Accede a tu cuenta de Google e ingresa a <strong className="text-white">Google Sites</strong> (<a href="https://sites.google.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline inline-flex items-center gap-1">sites.google.com <ExternalLink className="h-3 w-3" /></a>).
                  </li>
                  <li className="pl-1">
                    Abre el sitio web donde deseas integrar la aplicación de <strong className="text-white">Limpiezas El Puerto</strong>.
                  </li>
                  <li className="pl-1">
                    En el panel lateral derecho, selecciona la pestaña <strong className="text-sky-300 font-semibold">Insertar</strong> y haz clic en el botón <strong className="text-sky-300 font-semibold">&lt;&gt; Incorporar (Embed)</strong>.
                  </li>
                  <li className="pl-1">
                    Cambia a la pestaña <strong className="text-white">Código de incorporación (Embed Code)</strong>.
                  </li>
                  <li className="pl-1">
                    Pega el código HTML generado y pulsa en <strong className="text-white">Siguiente</strong> y luego <strong className="text-white">Insertar</strong>.
                  </li>
                  <li className="pl-1">
                    Arrastra los bordes del bloque en Google Sites para darle el ancho deseado y haz clic en <strong className="text-emerald-400">Publicar</strong>.
                  </li>
                </ol>
              </div>

              <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-4 text-xs text-sky-200 space-y-2">
                <div className="font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Ventajas de este método
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Cualquier actualización realizada en el panel de administración o en la base de datos de <strong>Limpiezas El Puerto</strong> se reflejará instantáneamente dentro de tu web de Google Sites sin necesidad de volver a editar el sitio.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Simulación en marco de Google Sites</span>
                <span className="text-sky-400">{currentUrl}</span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 h-[450px]">
                <iframe
                  src={currentUrl}
                  className="w-full h-full border-none"
                  title="Simulación Google Sites"
                />
              </div>
            </div>
          )}
        </div>

        {/* User Confirmation Dialog before writing to Drive */}
        {showConfirmUpload && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Guardar en Google Drive
                  </h3>
                  <p className="text-xs text-slate-400">
                    Se creará un archivo nuevo en tu unidad
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <p>¿Deseas guardar el paquete de integración de <strong>Limpiezas El Puerto</strong> en tu cuenta de Google Drive (<strong>{googleUser?.email}</strong>)?</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmUpload(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteDriveSave}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirmar y Guardar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="h-4 w-4 text-sky-400" />
            <span>URL pública: <span className="text-slate-200 font-mono text-[11px]">{currentUrl}</span></span>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg transition-colors cursor-pointer"
            id="btn-close-google-sites-bottom"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
