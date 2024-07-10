import get_config from "./config/config";
import app from "./index";


const port = get_config("PORT") || 3030

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})