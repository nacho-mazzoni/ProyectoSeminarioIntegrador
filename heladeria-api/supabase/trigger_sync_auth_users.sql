-- ============================================================================
-- Trigger: Sincronizar auth.users → public.usuario
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================================

-- 1. Hacer la columna clave nullable (Supabase Auth maneja las contraseñas)
ALTER TABLE public.usuario ALTER COLUMN clave DROP NOT NULL;

-- 2. Función que copia el email de auth.users a public.usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuario (email, activo, id_rol)
  VALUES (NEW.email, true, 2);
  RETURN NEW;
END;
$$;

-- 3. Trigger que se dispara al crear usuario en Supabase Auth
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Sincronizar usuarios existentes (opcional - si ya hay registros en auth.users)
-- INSERT INTO public.usuario (email, activo, id_rol)
-- SELECT email, true, 2 FROM auth.users
-- ON CONFLICT (email) DO NOTHING;
