#language:ru
#noinspection NonAsciiCharacters

Функционал: Комментирование постов
  Для того, чтобы пользоваться приложенем now-i-am
  Как обычный пользователь
  Я должен иметь возможность комментировать посты пользователей

  @comments-post
  Сценарий: Комментирование постов
    Допустим  я нахожусь на странице "Логин"
    Если я ввожу в поля формы:
      | Почтовый адрес | anna@gmail.com |
      | Пароль         | 123            |
    И нажимаю на кнопку формы "Войти"
    То я должен увидеть текст "Вход успешно выполнен!"
    Если я ввожу в поля формы:
      | Название занятия... | Пью |
    Допустим я кликаю на текст "Пью кофе"
    Допустим я кликаю на текст "Поиск"
    То я должен увидеть текст "Количество людей с похожим занятием"
    Если я кликаю на пост со стилями ".post__image-block"
    То я должен увидеть текст "Показать комментарии"
    Допустим я кликаю на текст "Показать комментарии"
    То я должен увидеть текст "Комментарии"
    Если я ввожу в поля формы:
      | Добавить комментарий | Классный пост |
    Допустим я кликаю на иконку со стилями ".send-icon"
    То я должен увидеть текст "Классный пост"