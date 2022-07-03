#language:ru
#noinspection NonAsciiCharacters

Функционал: Уведомлений о поступлении запроса на дружбу
  Для того, чтобы пользоваться приложенем now-i-am
  Как обычный пользователь
  Я должен иметь возможность получать уведомления по поступлении запросов на дружбу

  @friendship-notification
  Сценарий: Уведомлений о поступлении запроса на дружбу
    Допустим  я нахожусь на странице "Логин"
    Если я ввожу в поля формы:
      | Почтовый адрес | anna@gmail.com |
      | Пароль         | 123            |
    И нажимаю на кнопку формы "Войти"
    То я должен увидеть текст "Вход успешно выполнен!"

    Допустим я ввожу в поля формы:
      | Название занятия | Пью |
    И я жду "3" секунд
    И я кликаю на текст "Пью чай"
    И нажимаю на кнопку формы "Поиск"
    То я должен увидеть текст "Пью чай"

    Допустим я кликаю на пост со стилями "[alt='John']"
    И я кликаю на текст "Профиль"
    И я кликаю на иконку со стилями "[title='Добавить в друзья']"
    То я должен увидеть текст "Запрос отправлен"

    Допустим я кликаю на иконку со стилями ".post-block__close"
    И я кликаю на кнопку со стилями ".user-avatar"
    И я кликаю на текст "Выйти"
    То я должен увидеть текст "Выход выполнен!"

    Допустим я нахожусь на странице "Логин"
    Если я ввожу в поля формы:
      | Почтовый адрес | john@gmail.com |
      | Пароль         | 123            |
    И нажимаю на кнопку формы "Войти"
    То я должен увидеть текст "Вход успешно выполнен!"
    И я жду "3" секунд
    И я вижу текст "1" со стилями "span.mat-badge-content"