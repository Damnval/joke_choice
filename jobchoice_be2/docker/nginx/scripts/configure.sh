#!/bin/bash
certbot --nginx --agree-tos --redirect --non-interactive -d $DOMAIN_LIST --email $DOMAIN_EMAIL