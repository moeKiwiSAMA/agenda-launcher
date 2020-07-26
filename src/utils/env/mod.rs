pub fn getCurrentDir() -> std::string::String {
    String::from(std::env::current_dir().unwrap().to_str().unwrap())
}
