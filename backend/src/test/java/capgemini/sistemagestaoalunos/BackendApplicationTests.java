package capgemini.sistemagestaoalunos;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:backend-test;DB_CLOSE_DELAY=-1",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.datasource.username=sa",
		"spring.datasource.password="
})
@AutoConfigureMockMvc
class BackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void swaggerUiRemainsPublicWithInvalidBearerToken() throws Exception {
		mockMvc.perform(get("/swagger").header("Authorization", "Bearer invalid"))
				.andExpect(status().is3xxRedirection());
	}

	@Test
	void apiDocsRemainPublicWithInvalidBearerToken() throws Exception {
		mockMvc.perform(get("/v3/api-docs").header("Authorization", "Bearer invalid"))
				.andExpect(status().isOk());
	}

}
