(function(){
  'use strict';
  const instances=new Map();
  function create(role='student'){
    if(instances.has(role))return instances.get(role);
    const config=window.HILOS_CONFIG||{};
    if(!window.supabase?.createClient)throw new Error('No se ha podido cargar la conexión. Recarga la página.');
    if(!config.url||!config.publishableKey)throw new Error('La actividad todavía no tiene configurada la conexión.');
    const client=window.supabase.createClient(config.url,config.publishableKey,{auth:{storageKey:`psp-hilos-${role}-v1`,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
    async function rpc(name,args={}){const {data,error}=await client.rpc(name,args);if(error)throw new Error(error.message||'No se ha podido completar la operación.');return data;}
    async function session(){const {data,error}=await client.auth.getSession();if(error)throw error;return data.session;}
    async function ensureStudent(){let s=await session();if(!s){const {data,error}=await client.auth.signInAnonymously();if(error)throw new Error(error.message.includes('disabled')?'La entrada de alumnado todavía no está habilitada. Avisa al profesor.':error.message);s=data.session;}return s;}
    async function teacherLogin(email,password){const {error}=await client.auth.signInWithPassword({email,password});if(error)throw new Error('No se ha podido iniciar sesión. Comprueba el correo y la contraseña.');const authorized=await rpc('hilos_am_teacher');if(!authorized){await client.auth.signOut();throw new Error('Esta cuenta no tiene acceso al panel de esta actividad.');}return true;}
    const api={client,rpc,session,ensureStudent,teacherLogin};instances.set(role,api);return api;
  }
  window.HilosAPI={create};
})();
