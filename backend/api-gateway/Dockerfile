# Usa un'immagine base con Java 21 (leggera, versione Alpine)
FROM eclipse-temurin:21-jdk-alpine

# Crea un volume temporaneo (utile per Tomcat)
VOLUME /tmp

# Copia il file .jar generato da Maven dentro l'immagine
# (Il nome *.jar prende qualsiasi file jar trovi nella cartella target)
COPY target/*.jar app.jar

# Comando di avvio
ENTRYPOINT ["java","-jar","/app.jar"]