#language:ru
#noinspection NonAsciiCharacters

Функционал: Отображение списка пользователей и карты
  Для того, чтобы пользоваться приложенем now-i-am
  Как обычный пользователь
  Я должен иметь возможность после ввода своего занятия увидеть количесво людей занимающихся тем же самым

  @statistic-view
  Сценарий: Отображение списка людей и карты
    Допустим  я нахожусь на странице "Главная станица"
    Если я ввожу в поля формы:
      | Название занятия | Пью кофе |
    И нажимаю на кнопку на кнопку формы "Посмотреть"
    То я вижу текст "Количество человек с похожим занятием" со стилями ".amount-user__title"
