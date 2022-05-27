#language:ru
#noinspection NonAsciiCharacters

Функционал: Отображение местоположения опубликованного поста
  Для того, чтобы пользоваться приложенем now-i-am
  Как обычный пользователь
  Я должен иметь возможность видеть местоположение постов

  @see-location-posts
  Сценарий: Отображение местоположения опубликованного поста
    Допустим  я нахожусь на странице "Логин"
    Если я ввожу в поля формы:
      | Почтовый адрес | anna@gmail.com |
      | Пароль         | 123qwe         |
    И нажимаю на кнопку формы "Войти"
    То я должен увидеть текст "Вход успешно выполнен!"
    Если я ввожу в поля формы:
      | Название поста | Пью коллу |
    Допустим я кликаю на иконку со стилями ".form__search-icon"
    Допустим я кликаю на иконку со стилями ".leaflet-marker-icon"
#    То я должен увидеть текст "Anna"
