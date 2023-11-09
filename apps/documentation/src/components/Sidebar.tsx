import { useLocation, useNavigate } from 'solid-start';

import { Box, List, ListItem, ListItemWithDetails } from '@terraprisma/general';
import { JSX } from 'solid-js';

function Link(props: { to: string; children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ListItem
      role="link"
      class="!h-fit"
      onClick={() => navigate(props.to)}
      clickable
      active={location.pathname === props.to}
    >
      {props.children}
    </ListItem>
  );
}

export function Sidebar() {
  return (
    <Box class="w-full h-full flex flex-col gap-4">
      <List>
        {/* <h1 class="text-lg text-[var(--muted-fg)] uppercase"> */}
        {/*   getting started */}
        {/* </h1> */}

        <Link to="/">overview</Link>
        {/* <Link to="/installation">installation</Link> */}
      </List>

      <List>
        <h1 class="text-lg text-[var(--muted-fg)] uppercase">components</h1>

        <ListItemWithDetails
          class="!h-fit"
          details={
            <List class="p-2 bg-[var(--deeper-bg-30)] rounded-md">
              <Link to="/components/general/dialog">dialog</Link>
              <Link to="/components/general/dropdown">dropdown</Link>
              <Link to="/components/general/ripple">ripple</Link>
              <Link to="/components/general/theme-provider">
                theme provider
              </Link>
              <Link to="/components/general/list">list</Link>
              <Link to="/components/general/buttons">buttons</Link>
            </List>
          }
        >
          @terraprisma/general
        </ListItemWithDetails>

        <ListItemWithDetails
          class="!h-fit"
          details={
            <List class="p-2 bg-[var(--deeper-bg-30)] rounded-md">
              <Link to="/components/data-display/table">table</Link>
              <Link to="/components/data-display/tooltip">tooltip</Link>
            </List>
          }
        >
          @terraprisma/data-display
        </ListItemWithDetails>

        <Link to="/components/icons">@terraprisma/icons</Link>
        <Link to="/components/transitions">@terraprisma/transitions</Link>

        <ListItemWithDetails
          class="!h-fit"
          details={
            <List class="p-2 bg-[var(--deeper-bg-30)] rounded-md">
              <Link to="/components/navigation/pagination">pagination</Link>
              <Link to="/components/navigation/steps">steps</Link>
              <Link to="/components/navigation/menu">menu</Link>
            </List>
          }
        >
          @terraprisma/navigation
        </ListItemWithDetails>
        <ListItemWithDetails
          class="!h-fit"
          details={
            <List class="p-2 bg-[var(--deeper-bg-30)] rounded-md">
              <Link to="/components/forms/createForm">createForm()</Link>
              <Link to="/components/forms/toggler">toggler</Link>
              <Link to="/components/forms/checkbox">checkbox</Link>
              <Link to="/components/forms/radio-group">radio group</Link>
              <Link to="/components/forms/input">input</Link>
              <Link to="/components/forms/textarea">textarea</Link>
            </List>
          }
        >
          @terraprisma/forms
        </ListItemWithDetails>
      </List>
    </Box>
  );
}
