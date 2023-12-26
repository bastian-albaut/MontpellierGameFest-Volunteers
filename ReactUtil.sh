#!/bin/bash

read -p "Enter the type of file you want to create (\"component\" or \"page\"): " arg

if [ "$arg" != "component" ] && [ "$arg" != "page" ]; then
  echo "Invalid type. Exiting..."
  exit 1
fi

read -p "Do you want to create a sass file? (0 for no, 1 for yes): " sass

if [ "$sass" != 0 ] && [ "$sass" != 1 ]; then
  echo "Invalid choice for Sass. Exiting..."
  exit 1
fi

read -p "Enter new file name: " name
read -p "Enter new directory name: " directoryName

create_folder_file () {
    mkdir -p src/$arg\s/$directoryName
    touch src/$arg\s/$directoryName/$name.tsx
}

create_with_sass () {
	create_folder_file
	(
	echo "import \"../../styles/${arg}s/$directoryName/$(tr [A-Z] [a-z] <<< "$name").module.scss\" "
	echo ""
	echo "const $name = () => {"
	echo -e "\treturn("
	echo ""
	echo -e "\t)"
	echo "}"
	echo ""
	echo "export default $name"
	) > src/$arg\s/$directoryName/$name.tsx

	mkdir -p src/styles/$arg\s/$directoryName
	touch src/styles/$arg\s/$directoryName/"$(tr [A-Z] [a-z] <<< "$name")".module.scss
}

create_without_sass () {
	create_folder_file
	(
	echo ""
	echo "const $name = () => {"
	echo -e "\treturn("
	echo ""
	echo -e "\t)"
	echo "}"
	echo ""
	echo "export default $name"
	) > src/$arg\s/$directoryName/$name.tsx
}

if [ "$arg" == "component" ]
then
    
    if [ "$sass" == 1 ]
    then
        create_with_sass
        echo "You successfully created component ${name} with sass in directory ${directoryName}"
    elif [ "$sass" == 0 ]
    then
        create_without_sass
        echo "You successfully created component ${name} without sass in directory ${directoryName}"
    else
        echo "Invalid choice for Sass. Exiting..."
        exit 1
    fi

elif [ "$arg" == "page" ] 
then

    if [ "$sass" == 1 ]
    then
        create_with_sass
        echo "You successfully created page ${name} with sass in directory ${directoryName}"
    elif [ "$sass" == 0 ]
    then
        create_without_sass
        echo "You successfully created page ${name} without sass in directory ${directoryName}"
    else
        echo "Invalid choice for Sass. Exiting..."
        exit 1
    fi

else
    echo "Invalid type. Exiting..."
    exit 1
fi
exit 0
