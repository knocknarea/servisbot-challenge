FROM nginx:latest 

COPY dist/ /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html


# Make port 80 available to the world outside the container
EXPOSE 80

# Run the nginx server
CMD ["nginx", "-g", "daemon off;"]