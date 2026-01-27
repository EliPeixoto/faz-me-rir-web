FROM quay.io/keycloak/keycloak:24.0

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

ENV KC_HOSTNAME=auth.controladindin.com.br
ENV KC_PROXY=edge

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start"]
