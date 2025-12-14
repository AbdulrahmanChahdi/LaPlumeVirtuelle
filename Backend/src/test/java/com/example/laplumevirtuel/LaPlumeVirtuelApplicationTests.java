package com.example.laplumevirtuel;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.security.user.name=test",
    "spring.security.user.password=test"
})
class LaPlumeVirtuelApplicationTests {

    @Test
    void contextLoads() {
    }

}
