# **SCSS**

## **Гайд по организации работы с SCSS**

## **_Новый синтаксис_**

- **Вместо `@import` используем `@use`**

`@use` позволяет не импортировать файл целиком, а лишь необходимые переменные и функции, миксины и создавать неймспейсы.
Таким образом можно иметь в нескольких файлах переменные с одинаковым именем.

Подробнее о директиве: [@use](https://sass-lang.com/documentation/at-rules/import)

Пример синтаксиса:

```scss
@use './utils/fonts' as *;
```

Импорт шрифтов в глобальный неймспейс

```scss
@use './utils/colors' as c;
//$white: #fff
@use './utils/colors-shadows' as d; //$shadow: rgb(0 0 0 / 0.5)

.some-class {
  color: c . white;
  box-shadow: 0 0 10px d . shadow;
}
```

Импорт шрифтов в локальный неймспейс

- **`@forward` и `index.scss`**

Чтобы ипортировать целиков все файлы из папки, можно создать `_index.scss` в котором указать через `@forward` к каким
файлам дает доступ этот файл. Подробнее о директиве: [@forward](https://sass-lang.com/documentation/at-rules/forward)

P.S. \_ перед файлом означает, что компилятор должен использовать данный файл только один раз, независимо от того,
сколько ссылок на него будет

- **silent-классы/шаблонные селекторы (placeholder selectors)**

Silent-классы позволяют создавать классы, которые не попадают в итоговый бандл, но позволяют избавиться от миксинов там,
где они не нужны и создать локальные повторяющиеся классы.

```scss
%inherit {
  color: inherit;
  font-weight: inherit;
  font-size: inherit;

  &-weight {
    font-weight: inherit;
  }

  &-size {
    font-size: inherit;
  }
}

----- .some-class {
  @extend %inherit;
}
```

[Подробнее](https://sass-lang.com/documentation/style-rules/placeholder-selectors)

## Миксины

- **abs.scss**

Миксин аболютного позиционирования

```scss
@use './abs.scss' as *;

.class {
  @include abs-position($top, $right, $bottom, $left);
}
```

- **font.scss**

Подключение шрифтов woff/woff2

```scss
@use './fonts.scss' as *;

.class {
  @include font-face($font-family, $file-path, $weight: normal, $style: normal, $asset-pipeline: false);
}
```

```scss
@use './abs.scss' as *;

.class {
  @include abs-position($top, $right, $bottom, $left);
}
```

- **rem.scss**

Переводит юниты в `rem`. Рекомендуется использовать везде весто пиксельным значений, включая марджины и паддинги, **но
не для `font-size`**.

```scss
margin-right:
rem

(
16
)
;
```

- **rfs.scss**

Респонсивный шрифт. Делает шрифт автоматически подстаиваемым на брейкпоинтах ниже указанного в настройках с переводом
пикселей в rem.

```scss
@include font-size(16); // - переведет 16 пикселей в rem и будет автоматически уменьшать по настройкам
```

Используется рефернс бустрап 5 версии. [Подробнее о настройках](https://github.com/twbs/rfs)

- **size.scss**

Данный миксин позволяет сразу указать все размеры, включая `min-*` и `max-*`

где:

`$width` - ширина

`$height` - высота. По умолчанию равна ширине.

```scss
.some-class {
  @include size(rem(16)) //  автоширина и высота по rem
}
```

Другие миксины можно найти в соостветствующей папке
