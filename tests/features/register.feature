#language:ru
#noinspection NonAsciiCharacters

Функционал: Регистрация пользователя
  Для того, чтобы пользоваться приложением now-i-am
  Как обычный пользователь
  Я должен иметь возможность зарегистрироваться

  @register
  Сценарий: Регистрация
    Допустим я нахожусь на странице "Регистрация"
    Если я ввожу в поля формы:
      | Имя            | Shon           |
      | Почтовый адрес | shon@gmail.com |
      | Пароль         | 123abcdf       |
    И нажимаю на кнопку формы "Зарегистрироваться"
    То я должен увидеть текст "Вы успешно зарегистрировались!"
