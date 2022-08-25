import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';

export default function PopUp({title,helperText,setState,action}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" size="lg" variant="solid">
          {title}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <FormControl>
              <FormLabel htmlFor="email">Enter room's name</FormLabel>
              <Input
                id="room"
                type="room"
                onChange={e => {
                  setState(e.target.value)}}
              />
              <FormHelperText>
                {helperText}
              </FormHelperText>
            </FormControl>
            <Button
              colorScheme="teal"
              size="md"
              variant="solid"
              onClick={action}
            >
              {title}
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
