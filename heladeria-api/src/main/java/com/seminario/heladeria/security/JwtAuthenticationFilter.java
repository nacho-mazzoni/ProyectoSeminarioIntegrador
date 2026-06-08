package com.seminario.heladeria.security;

import com.seminario.heladeria.entity.Usuario;
import com.seminario.heladeria.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SecretKey secretKey;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            @Value("${supabase.jwt-secret}") String jwtSecret,
            UsuarioRepository usuarioRepository) {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.get("email", String.class);

            if (email != null) {
                Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

                if (usuario != null && usuario.getActivo()) {
                    String roleName = usuario.getRol().getNombreRol();
                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + roleName.toUpperCase()));

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(usuario, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception ignored) {
        }

        filterChain.doFilter(request, response);
    }
}
