import React, { useState, useEffect, useRef } from "react";
import Keycloak, { KeycloakInstance } from "keycloak-js";

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const keyCloakConfig: KeycloakConfig = {
  url: "http://localhost:8080",
  realm: "Dentrite_assignment",
  clientId: "myclient",
};

const keycloak: KeycloakInstance = new Keycloak(keyCloakConfig);
console.log("hello");
const useAuth = (): [boolean, string | null] => {
  const isRun = useRef(false);
  const [isLogin, setLogin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    console.log("hello");

    keycloak
      .init({ onLoad: "login-required" })
      .then((res) => {
        setLogin(res);
        if (keycloak.token) {
          setToken(keycloak.token);
        } else {
          setToken(null);
        }
      })
      .catch((err) => alert(err));
  }, [token]);
  return [isLogin, token];
};

export default useAuth;
