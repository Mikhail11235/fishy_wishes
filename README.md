# 𓇼 ⋆.˚ 𓆉 𓆝 𓆡⋆.˚ 𓇼 Wishlist Project 𓇼 ⋆.˚ 𓆉 𓆝 𓆡⋆.˚ 𓇼

A simple solution for keeping track of all your gift desires. Whether you're planning your next big gift or just organizing your personal wish list, this project has got you covered. Dive into the details and see how you can make your wishlist both stylish and functional.

<details>
  <summary>📸 Screenshots</summary>

### 🖥️ Admin

<img width="600" alt="Admin" src="https://github.com/user-attachments/assets/7c6559df-3ebb-43a2-9101-ac628b6f4bc8">

*Screenshot of the Django admin interface where you can manage users and wishlist items.*

### 👤 Unauthenticated User
<img src="https://github.com/user-attachments/assets/996770ac-0c52-4f87-8cbd-0362e0f41f5e" alt="Unauthenticated User" width="600" />

*How the site appears to users who are not logged in.*

### 📱 Mobile View

<img src="https://github.com/user-attachments/assets/a710adb2-bea9-4e74-b8e2-4390212ce630" alt="Mobile View" height="600" />

*Example of how the wishlist looks on a mobile device.*
</details>

<details>
  <summary>🚀 Quick Start</summary>

1. **Clone the repository, navigate to the project directory, and create a `prod.env` file**:
    ```bash
    git clone https://github.com/Mikhail11235/fishy_wishes.git
    cd fishy_wishes
    ```

    Create a `prod.env` file with the necessary environment variables. Example:
    ```env
    HOST=YOUR_HOST
    PGNAME=YOUR_DB_NAME
    PGUSER=YOUR_DB_USER
    PGPASSWORD=YOUR_DB_PASSWORD
    PGHOST=db
    PGPORT=5432
    DJANGO_SUPERUSER_USERNAME=YOUR_DJANGO_SUPERUSER_USERNAME
    DJANGO_SUPERUSER_EMAIL=YOUR_DJANGO_SUPERUSER_EMAIL
    DJANGO_SUPERUSER_PASSWORD=YOUR_DJANGO_SUPERUSER_PASSWORD
    ```

2. **Start Docker Compose**:
    - To start the application with Docker Compose, use:
    ```bash
    docker-compose --env-file prod.env up -d --build
    ```

    - For local development with debugging enabled, modify the `local.env`:
    ```env
    HOST=*
    PGHOST=localhost
    ```
     Set `DEBUG=True` `LOCAL=TRUE` in `settings.py`

    Then start the application:
    ```bash
    python3 manage.py runserver
    ```

3. **Run database migrations, collect static files, and compile messages**:
    ```bash
    docker-compose exec web python manage.py wishlist makemigrations
    docker-compose exec web python manage.py migrate
    docker-compose exec web python manage.py collectstatic
    docker-compose exec web django-admin compilemessages
    ```
</details>
<details>
  <summary>🌐 How to Use</summary>
  
1. **Open your browser and go to**: `http://your_domain`

2. **Browse your wishlist, add and remove items as you like.**

3. **Add a separate user for gift booking**:
    - Log in to the Django admin interface using your superuser credentials.
    - Go to the **"Users"** section and click **"Add User"**.
    - Enter a **username** and **password** for the new user, then click **"Save"**.

    This new user will now be able to manage gift bookings. 🎁
</details>
<details>
  <summary>🛠️ Setting Up a System Service</summary>

1. **Create a systemd service file**:

    ```bash
    sudo nano /etc/systemd/system/wishlist.service
    ```

    Add the following content to the file:

    ```ini
    [Unit]
    Description=Wishlist Service
    After=network.target

    [Service]
    Type=simple
    WorkingDirectory=/path/to/your_project
    ExecStart=/usr/local/bin/restart-wishlist.sh
    ExecReload=/usr/local/bin/restart-wishlist.sh
    Restart=on-failure
    RestartSec=120
    User=your_user
    Group=your_group

    [Install]
    WantedBy=multi-user.target
    ```

    Replace `/path/to/your_project`, `/usr/local/bin/restart-wishlist.sh`, `your_user`, and `your_group` with the appropriate values for your setup.

2. **Create the restart script**:

    ```bash
    sudo nano /usr/local/bin/restart-wishlist.sh
    ```

    Add the following content to the script:

    ```bash
    #!/bin/bash

    cd /path/to/your_project

    /usr/local/bin/docker-compose --env-file prod.env down

    /usr/local/bin/docker-compose --env-file prod.env up -d --build
    ```

    Make the script executable:

    ```bash
    sudo chmod +x /usr/local/bin/restart-wishlist.sh
    ```

3. **Reload systemd and start the service**:

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable wishlist.service
    sudo systemctl start wishlist.service
    ```

4. **Check the status of your service**:

    ```bash
    sudo systemctl status wishlist.service
    ```
</details>

This project is licensed under the [MIT License](LICENSE).
If you have ideas for improvements or want to help with development, feel free to create a Pull Request or open an Issue.
