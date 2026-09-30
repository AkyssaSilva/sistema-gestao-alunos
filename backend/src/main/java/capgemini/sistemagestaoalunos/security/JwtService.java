package capgemini.sistemagestaoalunos.security;

import capgemini.sistemagestaoalunos.domain.usuario.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(Usuario usuario){
       try {
           Algorithm algoritmo = Algorithm.HMAC256(secret);

           return JWT.create()
                   .withSubject(usuario.getNomeUsuario())
                   .withClaim("perfil", usuario.getPerfil().name())
                   .withExpiresAt(generateExpirationDate())
                   .sign(algoritmo);

       } catch (JWTCreationException exception){
           throw new RuntimeException("Erro ao gerar token");
       }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

    private DecodedJWT getDecodedJwt(String token){

        Algorithm algorithm = Algorithm.HMAC256(secret);

        return JWT.require(algorithm)
                .build()
                .verify(token);
    }

    public String extractUsername(String token){
        return getDecodedJwt(token).getSubject();
    }

    public Date extractExpiration(String token){
        return getDecodedJwt(token).getExpiresAt();
    }

    public String extractPerfil(String token){
        return getDecodedJwt(token).getClaim("perfil").asString();
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals
                (userDetails.getUsername())
                && !isTokenExpired(token);
    }

}
