use web_view::*;
mod utils;

use utils::env::*;

fn main() {
    let indexPath = format!("file:///{}/resources/index.html", getCurrentDir());
    web_view::builder()

        .title("Agenda Minecraft Launcher")
        .content(Content::Url(indexPath))
        .size(900, 520)
        .resizable(false)
        .debug(true)
        .user_data(())
        .invoke_handler(|_webview, _arg| Ok(()))
        .run()
        .unwrap();
}

