package com.seminario.heladeria.security;

import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.UsuarioRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomJwtAuthenticationConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {

    private final UsuarioRepository usuarioRepository;

    public CustomJwtAuthenticationConverter(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) return null;

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null || !Boolean.TRUE.equals(usuario.getActivo())) return null;

        String roleName = usuario.getRol().getNombreRol().trim().toUpperCase();
        if (!List.of("CLIENTE", "CAJERO", "ADMINISTRADOR").contains(roleName)) return null;
        List<SimpleGrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName));

        return new UsernamePasswordAuthenticationToken(usuario, jwt, authorities);
    }
}
