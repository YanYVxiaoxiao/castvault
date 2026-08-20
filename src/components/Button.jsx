import clsx from "clsx";

const Button = ({
  id,
  title,
  rightIcon,
  leftIcon,
  containerClass,
  onClick,
  href,
  type = "button",
  target = "_self",
  rel = "noopener noreferrer",
}) => {
  const Element = href ? "a" : "button"; // Use `a` for links, `button` for actions

  return (
    <Element
      id={id}
      href={href} // This will only be used if it's an `a` element
      onClick={onClick}
      type={href ? undefined : type} // `type` only applies to buttons
      target={href ? target : undefined}
      rel={href ? rel : undefined}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black transition-all duration-300 hover:scale-[1.03]",
        containerClass
      )}
    >
      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </Element>
  );
};

export default Button;
