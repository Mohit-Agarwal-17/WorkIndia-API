# WorkIndia-API
1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

1. Install dependencies:

    ``` bash
    npm install
    ```

2. Set up environment variables:

    Create a `.env` file in the root of your project and add the following:

    ```env
    PORT=4000

    DB_HOST=localhost
    DB_USER=root
    DB_PASS=Mohit@123
    DB_NAME=inshorts
    DB_PORT=3307
    
    JWT_SECRET=mohitapp
    SECRET_KEY=secret

    ```

3. Start the server:

    ```bash
    nodemon server.js
    ```
