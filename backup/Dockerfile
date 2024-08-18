FROM alpine:latest

RUN apk add --no-cache postgresql-client bash

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

CMD ["sh", "-c", "while true; do /usr/local/bin/backup.sh; sleep 86400; done"]